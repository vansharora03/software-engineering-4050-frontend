import InputField from "@/components/InputField";
import NavBar from "@/components/NavBar";

export default function Register() {
    return (
        <>
        <NavBar></NavBar>
        <div className="h-screen flex flex-col justify-center items-center">
        <p className="text-5xl font-bold mb-14">Sign up</p> {/* Adjust the mb-6 value as needed */}
        <InputField label="First Name" placeholder="Enter your first name" />
        <InputField label="Last Name" placeholder="Enter your last name" />
        <InputField label="Email" placeholder="Enter your email" />
        <InputField label="Password" placeholder="Enter your password" />
        <InputField label="Confirm Password" placeholder="Confirm your password" />
        <button className="shadow appearance-none border rounded w-96 py-2 px-2 mt-4 mb-5 text-white-700 leading-tight focus:outline-none focus:shadow-outline">Sign up</button>
        <p>
          Already registered?{" "}
          <a 
            href="/login" 
            className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
          >
            Sign in
          </a>
        </p>
      </div>
        </>
    );
}
