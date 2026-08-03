import { Provider } from 'react-redux'
import { ToastContainer, Slide } from 'react-toastify'
import Router from './Router/Router'
import { ThemeProvider } from '@/lib/theme'
import { store } from './store/store'
import { useEffect } from 'react'
import { loadUser } from './services/auth'

function App() {

  
  return (
      <Provider store={store}>
       <ToastContainer
        position="bottom-right"
        autoClose={1800}
        hideProgressBar
        transition={Slide} 
        closeOnClick
        draggable={false}
        theme="light"
      />
      <ThemeProvider>
        <Router/>
      </ThemeProvider>
      </Provider>
  )
}

export default App
