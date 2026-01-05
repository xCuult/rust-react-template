import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';

interface RegisterFormValues {
    username: string;
    password: string;
    confirmPassword: string;
}

const validate = (values: RegisterFormValues) => {
    const errors: Partial<RegisterFormValues> = {};

    if (!values.username.trim()) {
        errors.username = 'Username is required!';
    } else if (values.username.length < 3) {
        errors.username = 'Username must be at least 3 characters!';
    } else if (values.username.length > 50) {
        errors.username = 'Username must be at most 50 characters!';
    }

    if (!values.password) {
        errors.password = 'Password is required!';
    } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters!';
    }

    if (values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match!'
    }

    return errors;
};

export function RegisterForm() {
    const { register, error, clearError } = useAuth();
    const navigate = useNavigate();

    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
        initialValues: { username: '', password: '', confirmPassword: '' },
        validate,
        onSubmit: async ({ username, password }) => {
            await register({ username, password });
            navigate('/dashboard', { replace: true });
        },
    });

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
                <Alert variant='error' onClose={clearError}>
                    {error}
                </Alert>
            )}

            <Input
                label='Username'
                name='username'
                type='text'
                autoComplete='username'
                value={values.username}
                onChange={handleChange}
                error={errors.username}
                placeholder='Enter username...'
            />

            <Input
                label='Password'
                name='password'
                type='password'
                autoComplete='new-password'
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                placeholder='Enter password...'
            />

            <Input
                label='Confirm password'
                name='confirmPassword'
                type='password'
                autoComplete='new-password'
                value={values.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder='Confirm your password...'
            />

            <Button type='submit' isLoading={isSubmitting} className='w-full'>
                Create Account
            </Button>

            <p className='text-center text-sm text-gray-600'>
                Already have an account?{' '}
                <Link
                    to='/login'
                    className='text-primary-600 hover:text-primary-700 font-medium'
                >
                    Sign In
                </Link>
            </p>
        </form>
    );
}