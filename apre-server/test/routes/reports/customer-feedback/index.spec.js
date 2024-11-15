/**
 * Author: Professor Krasso
 * Date: 10 September 2024
 * File: index.spec.js
 * Description: Test the customer feedback API
 */

// Require the modules
const request = require('supertest');
const app = require('../../../../src/app');
const { mongo } = require('../../../../src/utils/mongo');

jest.mock('../../../../src/utils/mongo');

// Test the customer feedback API
describe('Apre Customer Feedback API', () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  // Test the channel-rating-by-month endpoint
  it('should fetch average customer feedback ratings by channel for a specified month', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              channels: ['Email', 'Phone'],
              ratingAvg: [4.5, 3.8]
            }
          ])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/customer-feedback/channel-rating-by-month?month=1'); // Send a GET request to the channel-rating-by-month endpoint

    // Expect a 200 status code
    expect(response.status).toBe(200);

    // Expect the response body to match the expected data
    expect(response.body).toEqual([
      {
        channels: ['Email', 'Phone'],
        ratingAvg: [4.5, 3.8]
      }
    ]);
  });

  // Test the channel-rating-by-month endpoint with missing parameters
  it('should return 400 if the month parameter is missing', async () => {
    const response = await request(app).get('/api/reports/customer-feedback/channel-rating-by-month'); // Send a GET request to the channel-rating-by-month endpoint with missing month
    expect(response.status).toBe(400); // Expect a 400 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: 'month and channel are required',
      status: 400,
      type: 'error'
    });
  });

  // Test the channel-rating-by-month endpoint with an invalid month
  it('should return 404 for an invalid endpoint', async () => {
    // Send a GET request to an invalid endpoint
    const response = await request(app).get('/api/reports/customer-feedback/invalid-endpoint');
    expect(response.status).toBe(404); // Expect a 404 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    });
  });
});

// Tests for Customer Feedback by Customer API
describe('Apre Customer Feedback by Customer API', () => {
  beforeEach(() => {
    mongo.mockClear();
  });

  // Test the customer-feedback-by-customer endpoint
  it('should fetch customer feedback from a specific customer', async () => {
    mongo.mockImplementation(async (callback) => {
      const db = {
        collection: jest.fn().mockReturnThis(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([
            {
              customer: "Jim Halpert",
              feedbackText: "Satisfactory, but could be better."
            }
          ])
        })
      };
      await callback(db);
    });

    const response = await request(app).get('/api/reports/customer-feedback/customer-feedback-by-customer/Jim+Halpert'); // Send a GET request to the customer-feedback-by-customer endpoint

    // Expect a 200 status code
    expect(response.status).toBe(200);

    // Expect the response body to match the expected data
    expect(response.body).toEqual([
      {
        customer: "Jim Halpert",
        feedbackText: "Satisfactory, but could be better."
      }
    ]);
  });

  // Test the customer-feedback-by-customer endpoint with missing parameters
  it('should return 400 if the customer parameter is missing', async () => {
    const response = await request(app).get('/api/reports/customer-feedback/customer-feedback-by-customer/'); // Send a GET request to the customer-feedback-by-customer endpoint with missing customer
    expect(response.status).toBe(400); // Expect a 400 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      error: 'customer is required',
      status: 400,
    });
  });

  // Test the customer-feedback-by-customer endpoint with an invalid customer
  it('should return 404 for an invalid endpoint', async () => {
    // Send a GET request to an invalid endpoint
    const response = await request(app).get('/api/reports/customer-feedback/customer-feedback-by-custoomer');
    expect(response.status).toBe(404); // Expect a 404 status code

    // Expect the response body to match the expected data
    expect(response.body).toEqual({
      message: 'Not Found',
      status: 404,
      type: 'error'
    });
  });
});