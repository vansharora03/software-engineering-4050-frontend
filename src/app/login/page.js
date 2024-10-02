import NavBar from "@/components/NavBar";
import InputField from "@/components/InputField";
//Need to add forgot password functionality. The button should take you to password recovery page
export default function Login() {
    return (
    <>
        <NavBar></NavBar>
        <div className="h-screen flex flex-col justify-center items-center">
        <p className="text-5xl font-bold mb-14">Login</p>
            <InputField label="Email" placeholder="Enter Email"></InputField>
            <InputField label="Password" placeholder="Enter Password"></InputField>
            <button className="shadow appearance-none border rounded w-96 py-2 px-2 mt-4 mb-5 text-white-700 leading-tight focus:outline-none focus:shadow-outline">Login</button>
            <a 
            href="/reset" 
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
          >
            Forgot Password
          </a>
        </div>
    </>
    );
}