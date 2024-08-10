interface RegistrationData {
  email: string;
  password: string;
  repeat_password?: string;
}

interface authData {
  email: string;
  password: string;
}

export const registrateUser = async (data: RegistrationData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}registration/`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

export const authUser = async (data: authData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}auth/login/?continue_uri=false`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

export const cofirmUser = async (confirmationCode: string) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}registration/${confirmationCode}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

export const resendConirmCode = async (email: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}registration/resend_code`, {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Ошибка:', error);
  }
};
