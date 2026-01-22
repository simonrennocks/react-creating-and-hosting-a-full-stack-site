import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export function useUser() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  return { user, isLoading }
}
