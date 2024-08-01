// // lib/auth.ts
// 'use client'
// import { useEffect, useState } from 'react';
// import { supabase } from './supabase';
// import { User } from '@supabase/supabase-js';

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       setUser(session?.user ?? null);
//     };

//     getUser();

//     const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => {
//       authListener.subscription?.unsubscribe();
//     };
//   }, []);

//   return user;
// }