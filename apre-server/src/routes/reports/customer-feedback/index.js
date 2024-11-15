/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre customer feedback API for the customer feedback reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');
const createError = require('http-errors');

const router = express.Router();

/**
 * @description
 *
 * GET /channel-rating-by-month
 *
 * Fetches average customer feedback ratings by channel for a specified month.
 *
 * Example:
 * fetch('/channel-rating-by-month?month=1')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/channel-rating-by-month', (req, res, next) => {
  try {
    const { month } = req.query;

    if (!month) {
      return next(createError(400, 'month and channel are required'));
    }

    mongo (async db => {
      const data = await db.collection('customerFeedback').aggregate([
        {
          $addFields: {
            date: { $toDate: '$date' }
          }
        },
        {
          $group: {
            _id: {
              channel: "$channel",
              month: { $month: "$date" },
            },
            ratingAvg: { $avg: '$rating'}
          }
        },
        {
          $match: {
            '_id.month': Number(month)
          }
        },
        {
          $group: {
            _id: '$_id.channel',
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channel: '$_id',
            ratingAvg: 1
          }
        },
        {
          $group: {
            _id: null,
            channels: { $push: '$channel' },
            ratingAvg: { $push: '$ratingAvg' }
          }
        },
        {
          $project: {
            _id: 0,
            channels: 1,
            ratingAvg: 1
          }
        }
      ]).toArray();

      res.send(data);
    }, next);

  } catch (err) {
    console.error('Error in /rating-by-date-range-and-channel', err);
    next(err);
  }
});

// Customer Feedback by Customer API Routes

/**
 * @description
 *
 * GET /customers
 *
 * Fetches a list of distinct customerIds.
 *
 * Example:
 * fetch('/customers')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/customers', (req, res, next) => {
  try {
    mongo (async db => {
      const customers = await db.collection('customerFeedback').distinct('customer');
      res.send(customers);
    }, next);
  } catch (err) {
    console.error('Error getting customers: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /customer-feedback-by-customer
 *
 * Fetches feedback from a specific customer
 *
 * Example:
 * fetch('/customer-feedback-by-customer/Jim+Halpert')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/customer-feedback-by-customer/:customer?', (req, res, next) => {
  const {customer} = req.params;

  if (!customer) {
    return res.status(400).json({
     error: 'customer is required',
     status: 400 });
  }

  try {
    mongo (async db => {
      const feedbackByCustomer = await db.collection('customerFeedback').aggregate([
        { $match: { customer: req.params.customer } },
        {
          $group: {
            _id: '$customer',
            feedback: {$addToSet: '$feedbackText'} ,
          }
        },
        {
          $project: {
            _id: 0,
            customer: '$_id',
            feedback: 1
          }
        },
      ]).toArray();
      res.send(feedbackByCustomer);
    }, next);
  } catch (err) {
    console.error('Error getting feedback by customer: ', err);
    next(err);
  }
});

module.exports = router;