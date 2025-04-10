import React from 'react'
import useUsersContext from '../hooks/use-users-context';
import { User } from '../context/User';

const Header: React.FC = () => {
  const { user, signOut } = useUsersContext();

  return (
    <header>
      <h1 className="title">
        Network with NMToken Dashboard
      </h1>
      {user && (
        <div className='mb-2 columns has-background-info-light'>
          <div className="column is-narrow">
            <div className="is-size-6">Welcome, <b>{user && (user as User).name}</b>!</div>
          </div>
          <div className="column">
            <button type="button" className="tag is-link" onClick={signOut}>Log out</button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header;

