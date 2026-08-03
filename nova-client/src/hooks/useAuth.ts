

const useAuth = () => {
    const userId=localStorage.getItem('nova-token')

  const isAuthenticated = userId ? true : false;


  
  return {
    isAuthenticated,
  };
};

export default useAuth;