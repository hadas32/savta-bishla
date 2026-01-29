import express from 'express';

export const urlNotFound = (req, res, next) => {
    next({
        status: 404,
        type:'not found',
        msg: `url not found (${req.url}, method: ${req.method})`
    });
};

export const errorHandler = (err, req, res, next) => {
    const error = {
        message: err.msg,
        type: err.type || 'Server Error',
        fixlink: 'index.html'
    };
    const { status = 500 } = err; 
    res.status(status).json({ error: error });
};