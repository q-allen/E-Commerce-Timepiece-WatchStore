export function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className="w-full p-2 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...props}
        />
    );
}
