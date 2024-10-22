import { useLocation } from 'react-router-dom';

const Register = () => {
    const location = useLocation(); // Use useLocation to access route state
    const { link } = location.state || {}; // Destructure link from location state

    console.log("Link from state:", link); // Log the link to the console

    return (
        <>
            {link ? ( // Check if the link exists before rendering iframe
                <iframe 
                    src={link} // Use the event link as the source
                    width="100%" // Set the width to 100% to fit the container
                    height="600px" // Set a height for the iframe
                    style={{ border: 'none' }} // Remove border for a cleaner look
                    title="Google Form"
                />
            ) : (
                <p>No link provided</p> // Fallback if no link is present
            )}
        </>
    );
}

export default Register;
