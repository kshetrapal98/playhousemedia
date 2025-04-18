// src/tests/authController.test.js
const { signup, login } = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock req and res objects
const mockReq = (body = {}) => ({ body });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mocks
jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller - signup', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return 400 if email already exists', async () => {
    const req = mockReq({
      username: 'john_doe',
      email: 'john@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
    });
    const res = mockRes();

    User.findOne.mockResolvedValue({ email: 'john@example.com' });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Email already exists',
    });
  });
});

describe('Auth Controller - login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return 401 for invalid credentials', async () => {
    const req = mockReq({
      email: 'wrong@example.com',
      password: 'WrongPassword',
    });
    const res = mockRes();

    User.findOne.mockResolvedValue(null); // Simulate user not found

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Invalid credentials',
    });
  });

  it('should login successfully and return token', async () => {
    const fakeUser = {
      _id: 'user123',
      email: 'john@example.com',
      password: 'hashed',
      toObject: () => ({
        _id: 'user123',
        email: 'john@example.com',
        username: 'john_doe',
        password: 'hashed',
      }),
    };

    const req = mockReq({
      email: 'john@example.com',
      password: 'Password123',
    });
    const res = mockRes();

    User.findOne.mockResolvedValue(fakeUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake-jwt-token');

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        token: 'fake-jwt-token',
      })
    );
  });
});
