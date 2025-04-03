
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/SendMail.css";
import AdminSidebar from "./AdminSidebar";
import { FaEnvelope } from "react-icons/fa";

const SendMail = () => {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendingEmailId, setSendingEmailId] = useState(null); // Track which email is being sent

    useEffect(() => {
        fetchQuotations();
    }, []);

    const fetchQuotations = async () => {
        try {
            setLoading(true);
            const response = await axios.get("https://tejas.avishkar.digital/manav-steel/back/api/quotations");
            setQuotations(response.data);
        } catch (error) {
            console.error("Error fetching quotations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = async (quotation) => {
        setSendingEmailId(quotation.id); // Set the current email being sent
        try {
            const response = await axios.post("https://tejas.avishkar.digital/manav-steel/back/api/send-email", {
                customerEmail: quotation.email,
                customerName: quotation.customer_name,
                products: Array.isArray(quotation.product_names) ? quotation.product_names.join(", ") : "N/A",
                totalPrice: quotation.total_price,
                quotationId: quotation.id,
            });

            if (response.status === 200) {
                alert("Email sent successfully!");
                fetchQuotations(); // Refresh data after sending email
            } else {
                alert("Failed to send email.");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Error sending email. Please try again.");
        } finally {
            setSendingEmailId(null); // Reset after sending
        }
    };

    return (
        <div className="send-mail-container">
            <AdminSidebar />
            <div className="content">
                <h2>Send Quotation Emails</h2>

                {loading ? (
                    <p>Loading quotations...</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Products</th>
                                <th>Total Price</th>
                                <th>Email Sent</th>
                                <th>Send Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quotations.map((quotation) => (
                                <tr key={quotation.id}>
                                    <td>{quotation.customer_name}</td>
                                    <td>{quotation.email}</td>
                                    <td>{Array.isArray(quotation.product_names) ? quotation.product_names.join(", ") : "N/A"}</td>
                                    <td>₹{quotation.total_price}</td>
                                    <td>{quotation.email_sent ? "Yes" : "No"}</td>
                                    <td>
                                        <button
                                            onClick={() => handleSendEmail(quotation)}
                                            className="send-email-btn"
                                            disabled={quotation.email_sent || sendingEmailId === quotation.id} // Disable if email already sent or in progress
                                        >
                                            {sendingEmailId === quotation.id ? "Sending..." : <><FaEnvelope /> Send</>}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SendMail;
