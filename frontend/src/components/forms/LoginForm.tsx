import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';

interface LoginFormValues {
    username: string;
    password: string;
}

const validate = (values: LoginFormValues) => {
    const errors: Partial<LoginFormValues> = {};

    if (!values.username.trim()) {
        errors.username = 'Username is required!';
    }
    if (!values.password) {
        errors.password = 'Password is required!';
    }

    return errors;
}

export function LoginForm() {
    const { login, error, clearError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
        initialValues: { username: '', password: '' },
        validate,
        onSubmit: async (formValues) => {
            await login(formValues);
            navigate(from, { replace: true });
        },
    });

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <Alert variant="error" onClose={clearError}>
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
                placeholder='Enter your username...'
            />

            <Input
                label='Password'
                name='password'
                type='password'
                autoComplete='current-password'
                value={values.password}
                onChange={handleChange}
                error={errors.password}
                placeholder='Enter your password...'
            />

            <Button
                type='submit'
                isLoading={isSubmitting}
                className='w-full'
            >
                Sign In
            </Button>

            <p className='text-center text-sm text-gray-600'>
                Create a new account{' '}
                <Link
                    to="/register"
                    className='text-primary-600 hover:text-primary-700 font-medium'
                >
                    Sign Up
                </Link>
            </p>
        </form>
    );
}