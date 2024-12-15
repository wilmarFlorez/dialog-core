const signup = (req, res) => {};

const login = (req, res) => {
  res.send('login route');
};

const logout = (req, res) => {
  res.send('logout route');
};

export { signup, login, logout };
