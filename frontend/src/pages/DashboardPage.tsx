import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export function DashboardPage() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100">
            <nav className="bg-white shadow">
                <div className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-x1 font-bold text-gray-900">Auth</h1>
                        <Button variant="secondary" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Card className="text-center">
                    <div className="py-12">
                        <h2 className="text-4x1 font-bold text-gray-900 mb-4">
                            Welcome!
                        </h2>
                        <p className="text-x1 text-gray-600 mb-8">
                            You are logged in as{' '}
                            <span className="font-semibold text-primary-600">
                                {user?.username}
                            </span>
                        </p>
                        <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                User details:
                            </h3>
                            <dl className="space-y-2 text-left">
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">UUID:</dt>
                                    <dd className="font-mono text-sm text-gray-900">{user?.id}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Username:</dt>
                                    <dd className="font-medium text-gray-900">{user?.username}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-600">Account created at:</dt>
                                    <dd className="text-gray-900">
                                        {user?.created_at
                                            ? new Date(user.created_at).toLocaleDateString()
                                            : '-'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    )
}