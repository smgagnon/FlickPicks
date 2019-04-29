'use strict';

module.exports = function deafultErrorHandler(error, req, res, next) {
  console.error(error);

  if (res.headersSend) next(error);
  else {
    res
      .status(500)
      .render('error', {
        pageId: 'error-500',
        title: 'Internal Server Error',
      });
  }
};
