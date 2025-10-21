'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password must be at least 8 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginProvider = () => {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: '/',
    }, {
      onSuccess: () => {
        router.push('/');
      },
      onError: (error) => {
        toast.error(error.error.message);
      },
    });
  };

  const isPending = form.formState.isSubmitting;
  return (
    <div className='flex flex-col w-full gap-6 border-0'>
      <Card className='w-full max-w-md mx-auto border-1 border-gray-200'>
        <CardHeader className='text-center'>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid gap-6'>
                <div className='flex flex-col gap-4 border-0' data-slot='card-action'>
                  <Button disabled={isPending} variant='outline' className='w-full border-1 border-gray-300' type='button'>
                    <Image src='/logos/github.svg' alt='GitHub' width={20} height={20} />
                    Continue with GitHub
                  </Button>
                </div>
              </div>
              <div className='grid gap-6'>
                <div className='flex flex-col gap-4 border-0' data-slot='card-action'>
                  <Button disabled={isPending}  variant='outline' className='w-full border-1 border-gray-300' type='button'>
                    <Image src='/logos/google.svg' alt='Google' width={20} height={20} />
                    Continue with Google
                  </Button>
                </div>
                <div className='flex flex-col gap-4'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type='email' placeholder='Enter your email' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type='password' placeholder='Enter your password' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={isPending} variant='default' className='w-full' type='submit'> Login </Button>
                </div>
                <div className='text-center text-sm'>
                  Don't have an account? <Link href='/signup' className='text-primary underline underline-offset-4'>Register</Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>

      </Card>
    </div>
  )
}

export default LoginProvider;