export function getStoredAdmin() {
  const token = localStorage.getItem('selynToken');
  const storedUser = localStorage.getItem('selynUser');

  if (!token || !storedUser) {
    return null;
  }

  try {
    const user = JSON.parse(storedUser);
    return user?.role === 'admin' ? { token, user } : null;
  } catch (_error) {
    clearStoredAdmin();
    return null;
  }
}

export function storeAdminSession(data) {
  localStorage.setItem('selynToken', data.token);
  localStorage.setItem('selynUser', JSON.stringify(data.user));
}

export function clearStoredAdmin() {
  localStorage.removeItem('selynToken');
  localStorage.removeItem('selynUser');
}
