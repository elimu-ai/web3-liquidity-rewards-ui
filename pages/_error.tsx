import type { NextPageContext } from 'next'

type ErrorPageProps = {
    statusCode?: number
}

function ErrorPage({ statusCode }: ErrorPageProps) {
    const title = statusCode ? `Error ${statusCode}` : 'Unexpected Error'

    return (
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-2 text-base text-gray-500">
                Something went wrong. Please refresh the page or try again later.
            </p>
        </main>
    )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res?.statusCode ?? err?.statusCode ?? 404
    return { statusCode }
}

export default ErrorPage
