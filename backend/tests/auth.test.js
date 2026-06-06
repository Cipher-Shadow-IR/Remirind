const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

let chai;
let chaiHttp;

before(async () => {
  chai = await import('chai');
  chaiHttp = (await import('chai-http')).default;
  chai.use(chaiHttp);
  const { expect } = chai;
  global.expect = expect;

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-list-test');
});

after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth API', () => {
  let userData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
  let token;

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', (done) => {
    chai.request.execute(app)
      .post('/api/auth/register')
      .send(userData)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property('token');
        expect(res.body.data.user).to.have.property('name', userData.name);
        expect(res.body.data.user).to.have.property('email', userData.email);
        done();
      });
  });

  it('should not register with existing email', (done) => {
    User.create(userData).then(() => {
      chai.request.execute(app)
        .post('/api/auth/register')
        .send(userData)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body.success).to.be.false;
          done();
        });
    });
  });

  it('should login with valid credentials', (done) => {
    User.create(userData).then(() => {
      chai.request.execute(app)
        .post('/api/auth/login')
        .send({ email: userData.email, password: userData.password })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data).to.have.property('token');
          done();
        });
    });
  });

  it('should not login with wrong password', (done) => {
    User.create(userData).then(() => {
      chai.request.execute(app)
        .post('/api/auth/login')
        .send({ email: userData.email, password: 'wrongpassword' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.success).to.be.false;
          done();
        });
    });
  });

  it('should return user with valid token', (done) => {
    User.create(userData).then(() => {
      chai.request.execute(app)
        .post('/api/auth/login')
        .send({ email: userData.email, password: userData.password })
        .end((err, res) => {
          token = res.body.data.token;
          chai.request.execute(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .end((err2, res2) => {
              expect(res2).to.have.status(200);
              expect(res2.body.data).to.have.property('email', userData.email);
              done();
            });
        });
    });
  });
});
