import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import StatusAlert, { StatusErrors } from '../../components/StatusAlert';
import useUsersContext from '../../hooks/use-users-context';

const SignIn: React.FC = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [farewell, setFarewell] = useState("");
  const [isValidForm, setIsValidForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [errors, setErrors] = useState<JSX.Element | null>(null);
  const { user, signIn } = useUsersContext();

  const onHandleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage([]);
    setErrors(null);
  };

  const onHandleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errorMessage: string[] = [];
    if (name === '') {
      errorMessage.push('Please enter name!');
    }
    if (password === '') {
      errorMessage.push('Please enter a password!');
    }

    try {
      await signIn({ email: name, password });
      setName("");
      setPassword("");
    } catch (error) {
      const statusErrors = error as Partial<StatusErrors>;
      setErrors(<StatusAlert statusErrors={statusErrors} />);
    }

    setErrorMessage(errorMessage);
    if (errorMessage.length === 0) {
      setIsValidForm(true);

    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setFarewell('')
    }, 5000)
    return () => clearInterval(interval)
  }, [isValidForm])

  return (
    <div className='panel ml-3'>
      <p className="panel-heading mb-4 is-size-5">Network Login </p>
      <div className='panel-block'>

        <form onReset={onHandleReset} onSubmit={onHandleLogin}>
          {errorMessage.length > 0 && (
            <div>
              <ul>
                {errorMessage.map((err, i) => {
                  return (<li key={i}>{err}</li>);
                })}
              </ul>
            </div>)}

          <div className="field">
            <label>Email</label>
            <div className="control">
              <input value={name}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                className={`uk-input ${name === '' && errorMessage.length && 'uk-alert-danger'}`} type="text" placeholder="temp@hello.co.nz" 
                autoComplete="email"/>
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div className="control">
              <input value={password}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                className={`uk-input ${password === '' && errorMessage.length && 'uk-alert-danger'}`} type="password" placeholder="password"
                autoComplete="current-password" />
            </div>
          </div>

          <div className='columns'>
            <div className="field column">
              <div className="control">
                <button type="submit" className="button is-link">Login</button>
              </div>
            </div>
            <div className="field column">
              <div className="control">
                <button type="reset" className="button is-link">Reset</button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className='panel-block'>
        {errors}
        {farewell}
        {user && JSON.stringify(user)}
      </div>
    </div>
  )
}

export default SignIn;

