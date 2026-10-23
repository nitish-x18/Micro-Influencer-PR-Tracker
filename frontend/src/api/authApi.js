export const loginUser = async (email, password) => {
  if (!email || !password) {
    return {
      success: false,
      message: "Email and password are required",
    };
  }

  const savedUser = JSON.parse(localStorage.getItem("user"));

  if (!savedUser) {
    return {
      success: false,
      message: "No registered account found",
    };
  }

  if (savedUser.email !== email) {
    return {
      success: false,
      message: "Email not registered",
    };
  }

  return {
    success: true,
    message: "Login successful",
    user: savedUser,
    token: "temporary-token",
  };
};


export const registerUser = async (
  name,
  email,
  password,
  confirmPassword
) => {
  if (!name || !email || !password || !confirmPassword) {
    return {
      success: false,
      message: "All fields are required",
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Passwords do not match",
    };
  }

  return {
    success: true,
    message: "Account created successfully",
    user: {
      name,
      email,
    },
  };
};