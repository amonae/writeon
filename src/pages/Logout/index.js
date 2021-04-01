import React, { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Redirect } from 'react-router-dom';

export function Logout() {
  const { user, setUser, loading } = useContext(UserContext);

  //todo: if server error, display that error to user

  useEffect(() => {
    if (user) {
      fetch('http://localhost:5000/logout', { credentials: 'include' });
      setUser(false);
    } else {
      return;
    }
  }, [user]);

  return <>{<Redirect push to="/" />}</>;
}
