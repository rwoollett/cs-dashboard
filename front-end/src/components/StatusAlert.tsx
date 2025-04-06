import React, { HTMLAttributes } from 'react';
import style from './StatusAlert.module.css';

export type StatusError = {
  message: string;
  field: string;
}

export interface StatusErrors {
  data?: {
    errors: StatusError[]; 
  }
  status?: string; 
  error?: string;
} 

interface StatusAlertProps {
  statusErrors: StatusErrors;
}

const StatusAlert = ({ statusErrors, className }: StatusAlertProps & HTMLAttributes<HTMLElement>): JSX.Element => {
  let outerClassNames = style.alert;
  if (className) {
    outerClassNames += ' ' + className;
  } 
  return (
    <div className={outerClassNames}>
      <ul>
        {statusErrors.data && statusErrors.data.errors.map(err => (
          <li key={err.field}>{err.message}</li>
        ))}
        {statusErrors.status && <li key={statusErrors.status}>{statusErrors.error}</li>}
      </ul>
    </div>
  );
};

export default StatusAlert;