const responseMiddleware = (req, res, next) => {
  if (!res.err) {
    res.status(200).json(res.data);
  } else {
    if (res.statusCode === 200) {
      res.status(400);
    }

    const error = {
      error: true,
      message: res.err,
    };
    res.json(error);
  }

  next();
};

export { responseMiddleware };
