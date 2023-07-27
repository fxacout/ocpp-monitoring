import NextAuth, { AuthOptions, getServerSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials'
import { socketServiceInstance } from "@/service/SocketService"
import axios from "axios"
import { hash } from '../../../utils/hash'
export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ACCOUNT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        /*
        
        const res = await fetch("/your/endpoint", {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const user = await res.json()
  
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user
        }
        */
       console.log(`Enable auth: ${process.env.ENABLE_AUTH}`)
       if (process.env.ENABLE_AUTH === 'true') {
        const hashedPassword = hash(credentials?.password!)
        const res = await axios.get(`http://user_service:3000/user/${credentials?.username}`)
        console.log(JSON.stringify(res))
        if (res.status !== 200) {
          console.log(`Error logging in: ${res.status}, ${res.data}`)
          return null
        }
        if (res.data.password !== hashedPassword) {
          console.log(`Incorrect password`)
          return null
        }
       }  
        // Return null if user data could not be retrieved
        return {
          id: '10',
          name: credentials?.username,
          email: `${credentials?.username}@ocppmonitoring.com`,
          image: 'http://localhost:3000/user.png'
        }
      }
    })
  ],
  events: {
    async signIn({user, account}) {
      await socketServiceInstance.emitUserLogin(user)
        console.log('Emitted user login')
        const res = await axios.post(`http://user_service:3000/user`, {
          name: user.name,
          email: user.email,
          image: user.image,
          password: 'Oauth',
          provider: account?.provider
        })
    },
    async signOut({token}) {
      if (token) {
        const res = await socketServiceInstance.emitUserLogout({...token, id: '10', image: 'http://localhost:3000/user.png'})
        console.dir(res.data)
      }
      console.log('Emitted user logout')
    }
  }
}
export default NextAuth(authOptions)