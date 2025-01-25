// import React, { useState } from "react";
// import styled from "styled-components";
// import { Music4 } from "lucide-react";


// const Container = styled.div`
//   width: 100%;
//   max-width: 400px;
//   padding: 2rem;
//   background-color: rgb(220, 90, 90); /* Light red background color */
//   border: 1px solid #ddd;
//   border-radius: 8px;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   transition: transform 0.2s;

//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
//   }
// `;

// const Header = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-bottom: 2rem;
// `;

// const IconWrapper = styled.div`
//   height: 64px;
//   width: 64px;
//   background: rgba(255, 255, 255, 0.2); /* Semi-transparent white */
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   margin-bottom: 1rem;
// `;

// const Title = styled.h1`
//   font-size: 1.5rem;
//   font-weight: bold;
//   color: white; /* White text for better contrast */
// `;

// const Subtitle = styled.p`
//   font-size: 0.875rem;
//   color: rgba(255, 255, 255, 0.8); /* Slightly lighter white for contrast */
//   margin-top: 0.5rem;
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// const Label = styled.label`
//   font-size: 0.875rem;
//   font-weight: 500;
//   color: white;
// `;

// const Input = styled.input`
//   width: 100%;
//   padding: 0.75rem;
//   border: 1px solid rgba(255, 255, 255, 0.5); /* Lighter white border */
//   border-radius: 4px;
//   background-color: rgba(255, 255, 255, 0.1); /* Subtle input background */
//   color: white;
//   font-size: 0.875rem;

//   &:focus {
//     outline: none;
//     border-color: white;
//     box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
//   }

//   &::placeholder {
//     color: rgba(255, 255, 255, 0.6); /* Placeholder color */
//   }
// `;

// const Button = styled.button`
//   width: 100%;
//   padding: 0.75rem;
//   background-color: rgba(255, 255, 255, 0.9); /* Almost white button */
//   color: rgb(220, 90, 90); /* Matches the container background */
//   font-size: 1rem;
//   font-weight: 500;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   transition: background-color 0.3s, transform 0.2s;

//   &:hover {
//     background-color: white; /* Fully white on hover */
//     transform: translateY(-2px);
//   }
// `;

// const ForgotPassword = styled.a`
//   display: block;
//   text-align: center;
//   margin-top: 1rem;
//   font-size: 0.875rem;
//   color: white;
//   text-decoration: none;

//   &:hover {
//     text-decoration: underline;
//   }
// `;

// export const SignInForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
  

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!email || !password) {
      
//       return;
//     }
    
//   };

//   return (
//     <Container>
//       <Header>
//         <IconWrapper>
//           <Music4 size={32} color="white" />
//         </IconWrapper>
//         <Title>Welcome Back!</Title>
//         <Subtitle>Sign in to your festival account</Subtitle>
//       </Header>
//       <Form onSubmit={handleSubmit}>
//         <div>
//           <Label htmlFor="email">Email</Label>
//           <Input
//             id="email"
//             type="email"
//             placeholder="your@email.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div>
//           <Label htmlFor="password">Password</Label>
//           <Input
//             id="password"
//             type="password"
//             placeholder="••••••••"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <Button type="submit">Sign In</Button>
//         <ForgotPassword href="#">Forgot your password?</ForgotPassword>
//       </Form>
//     </Container>
//   );
// };

// export default SignInForm;
