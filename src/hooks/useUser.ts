'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Session } from '@supabase/supabase-js'

export function useUser() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const syncSession = async () => {
            const { data, error } = await supabase.auth.getSession()
            if (error || !data.session) {
                setSession(null)
            } else {
                setSession(data.session)
            }
            setLoading(false)
        }

        syncSession()

        const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession || null)
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    return { session, user: session?.user, loading }
}
