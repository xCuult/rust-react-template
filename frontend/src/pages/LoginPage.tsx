import { Card, CardHeader } from '../components/ui/Card';
import { LoginForm } from '../components/forms/LoginForm';

export function LoginPage() {
    return (
        <div className='min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 to-gray-100'>
            <Card className='w-full max-w-md'>
                <CardHeader
                    title='Welcome back'
                    subtitle='Sign In to your account'
                />
                <LoginForm />
            </Card>
        </div>
    );
}