exports.throwServerError = async (req, res, next) => {
  try {
    // Intentionally throw an error to simulate a crash
    throw new Error('Intentional server-side error for testing!');
  } catch (err) {
    err.status = 500;
    next(err); // Pass to your existing middleware
  }
}

