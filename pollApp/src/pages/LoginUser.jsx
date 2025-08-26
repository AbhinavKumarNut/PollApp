import { useState } from 'react'
import { useNavigate } from 'react-router-dom';


function LoginForm({ loginSuccess }) {
  const [value, setValue] = useState({
    username: "",
    password: ""
  })

  const [error, setError] = useState('');

  const handleChanges = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value })
  }
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(value)
      })
      if (response.ok) {
        loginSuccess(value.username);
        navigate('/home', { state: { name: value.username } });
      }
      else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed. Please check your credentials.');
      }
    }
    catch (error) {
      console.error('Error during login:', error);
      setError('Network error. Please try again later.');
    }
  }

  return <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Username
        </label>
        <input
          type="text"
          name="username"
          placeholder='Enter your username'
          onChange={(e) => handleChanges(e)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder='Enter your password'
          onChange={(e) => handleChanges(e)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">
          {error}
        </p>
      )}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition duration-300"
      >
        Login
      </button>
    </form>
  </div>
}

export default LoginForm;

