'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';

const registerSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Confirm password must be at least 8 characters long"),
})
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterProvider = () => {
    const router = useRouter();
    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (values: RegisterFormValues) => {
         await authClient.signUp.email({
            name: values.email,
            email: values.email,
            password: values.password,
            callbackURL: '/',
        }, {
            onSuccess: () => {
                router.push('/');
                console.log('Account created successfully');
            },
            onError: (error) => {
                toast.error(error.error.message);
            },
        });
      
    };

    const isPending = form.formState.isSubmitting;
    return (
        <div className='flex flex-col w-full gap-6'>
            <Card className='w-full max-w-md mx-auto'>
                <CardHeader className='text-center'>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create an account to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                            <div className='grid gap-6'>
                                <div className='flex flex-col gap-4'>
                                    <Button disabled={isPending} variant='outline' className='w-full' type='button'>
                                        Sign up with GitHub
                                    </Button>
                                </div>
                            </div>
                            <div className='grid gap-6'>
                                <div className='flex flex-col gap-4'>
                                    <Button disabled={isPending} variant='outline' className='w-full' type='button'>
                                        Sign up with Google
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
                                    <FormField
                                        control={form.control}
                                        name='confirmPassword'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                    <Input type='password' placeholder='Confirm your password' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button disabled={isPending} variant='default' className='w-full' type='submit'> Sign up </Button>
                                </div>
                                <div className='text-center text-sm'>
                                    Already have an account? <Link href='/login' className='text-primary underline underline-offset-4'>Login</Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>

            </Card>
        </div>
    )
}

export default RegisterProvider;