import { Card, CardHeader } from '../components/ui/Card';
import { RegisterForm } from '../components/forms/RegisterForm';

export function RegisterPage() {
    return (
        <div className='min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-primary-50 to-gray-100'>
            <Card className='w-full max-w-md'>
                <CardHeader
                    title='Create account'
                    subtitle='Register'
                />
                <RegisterForm />
            </Card>
        </div>
    );
}