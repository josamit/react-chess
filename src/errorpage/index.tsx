import React, { FC } from 'react';
import { useRouteError } from 'react-router-dom';

import style from './errorpage.module.scss';

interface RouteError {
  statusText?: string;
  message?: string;
}

const ErrorPage: FC = () => {
  const error: RouteError = useRouteError() as RouteError;
  console.error(error);

  return (
    <div id='error-page' className={style.errorPage}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText ?? error.message}</i>
      </p>
    </div>
  );
};

export default ErrorPage;
