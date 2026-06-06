const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

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
  await Task.deleteMany({});
  await mongoose.connection.close();
});

describe('Task API', () => {
  let token;
  let taskId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});

    const user = await User.create({ name: 'Test', email: 'test@example.com', password: 'password123' });

    const jwt = require('jsonwebtoken');
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'test-secret');
  });

  it('should create a task', (done) => {
    chai.request.execute(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Task', priority: 'high' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.have.property('title', 'Test Task');
        expect(res.body.data).to.have.property('priority', 'high');
        expect(res.body.data).to.have.property('status', 'pending');
        taskId = res.body.data._id;
        done();
      });
  });

  it('should get all tasks', (done) => {
    chai.request.execute(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('array');
        done();
      });
  });

  it('should get a single task', (done) => {
    Task.create({ title: 'Single Task', userId: '000000000000000000000001' }).then(() => {
      Task.findOne().then((task) => {
        chai.request.execute(app)
          .get(`/api/tasks/${task._id}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.data).to.have.property('title', 'Single Task');
            done();
          });
      });
    });
  });

  it('should update a task', (done) => {
    Task.create({ title: 'Update Me', userId: '000000000000000000000001' }).then((task) => {
      chai.request.execute(app)
        .put(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated', status: 'completed' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.data).to.have.property('title', 'Updated');
          expect(res.body.data).to.have.property('status', 'completed');
          done();
        });
    });
  });

  it('should delete a task', (done) => {
    Task.create({ title: 'Delete Me', userId: '000000000000000000000001' }).then((task) => {
      chai.request.execute(app)
        .delete(`/api/tasks/${task._id}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          done();
        });
    });
  });

  it('should get dashboard stats', (done) => {
    chai.request.execute(app)
      .get('/api/tasks/stats')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).to.have.all.keys('total', 'pending', 'completed', 'highPriority');
        done();
      });
  });
});
