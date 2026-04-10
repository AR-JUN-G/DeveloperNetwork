import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { FiSave, FiX, FiCheckCircle } from "react-icons/fi";
import { ProfileDataType } from "../../Types/ProfileAPI.types";
import { getProfileAPI, editProfileAPI } from "../../API/ProfileAPI";
import { updateUserDetails } from "../../Store/userSlice";
import "./Profile.css";

const Profile = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [skillInput, setSkillInput] = useState("");
    
    const [formData, setFormData] = useState<Partial<ProfileDataType>>({
        firstName: "",
        lastName: "",
        age: undefined,
        gender: "",
        about: "",
        photourl: "",
        skills: []
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            const response = await getProfileAPI();
            if (response.status === 200 && response.data) {
                setFormData(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
            showToast("Failed to load profile data", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "age" ? parseInt(value) || undefined : value
        }));
    };

    const handleAddSkill = (e: React.MouseEvent | React.KeyboardEvent) => {
        if ('key' in e && e.key !== 'Enter') return;
        e.preventDefault();
        
        if (skillInput.trim() && !(formData.skills || []).includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...(prev.skills || []), skillInput.trim()]
            }));
            setSkillInput("");
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: (prev.skills || []).filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const response = await editProfileAPI(formData);
            
            if (response.status === 200 && response.data) {
                showToast("Profile updated successfully", "success");
                
                // Update Redux state so the sidebar and other components immediately pick up the changes
                dispatch(updateUserDetails({
                    userID: response.data.data._id,
                    firstName: response.data.data.firstName,
                    lastName: response.data.data.lastName,
                    email: response.data.data.emailId,
                    photourl: response.data.data.photourl
                }));
            } else {
                showToast("Update failed", "error");
            }
        } catch (error) {
            console.error("Save failed", error);
            showToast("An error occurred while saving", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    if (isLoading) {
        return <div className="loading-spinner-container"><div className="spinner"></div></div>;
    }

    return (
        <div className="profile-page">
            <header className="profile-header">
                <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    Edit Profile
                </motion.h1>
                <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    Manage your personal information and developer identity.
                </motion.p>
            </header>

            <motion.form 
                className="profile-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleSave}
            >
                <div className="profile-top-section">
                    <div className="profile-avatar-container">
                        <img 
                            src={formData.photourl || `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=6366f1&color=fff&size=256`} 
                            alt="Profile" 
                            className="profile-avatar"
                        />
                    </div>
                    <div className="profile-info">
                        <h2>{formData.firstName} {formData.lastName}</h2>
                        <p>{formData.emailId}</p>
                    </div>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                        <label>First Name</label>
                        <input 
                            type="text" 
                            name="firstName" 
                            value={formData.firstName || ""} 
                            onChange={handleInputChange} 
                            className="form-input"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Last Name</label>
                        <input 
                            type="text" 
                            name="lastName" 
                            value={formData.lastName || ""} 
                            onChange={handleInputChange} 
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Age</label>
                        <input 
                            type="number" 
                            name="age" 
                            value={formData.age || ""} 
                            onChange={handleInputChange} 
                            className="form-input"
                            min="18"
                            max="120"
                        />
                    </div>

                    <div className="form-group">
                        <label>Gender</label>
                        <select 
                            name="gender" 
                            value={formData.gender || ""} 
                            onChange={handleInputChange} 
                            className="form-select"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label>Photo URL</label>
                        <input 
                            type="url" 
                            name="photourl" 
                            value={formData.photourl || ""} 
                            onChange={handleInputChange} 
                            className="form-input"
                            placeholder="https://example.com/photo.jpg"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>About Me</label>
                        <textarea 
                            name="about" 
                            value={formData.about || ""} 
                            onChange={handleInputChange} 
                            className="form-textarea"
                            placeholder="Tell other developers about yourself..."
                            maxLength={500}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Skills</label>
                        <div className="skills-container">
                            <div className="skills-input-wrapper">
                                <input 
                                    type="text" 
                                    value={skillInput} 
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={handleAddSkill}
                                    className="form-input"
                                    placeholder="Add a new skill (e.g. React, Node.js)"
                                />
                                <button type="button" className="add-skill-btn" onClick={handleAddSkill}>
                                    Add
                                </button>
                            </div>
                            <div className="skills-list">
                                <AnimatePresence>
                                    {(formData.skills || []).map((skill) => (
                                        <motion.div 
                                            key={skill}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="skill-tag"
                                        >
                                            {skill}
                                            <span 
                                                className="remove-skill" 
                                                onClick={() => handleRemoveSkill(skill)}
                                            >
                                                <FiX size={14} />
                                            </span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    <button type="submit" className="save-btn" disabled={isSaving}>
                        {isSaving ? (
                            <>Saving...</>
                        ) : (
                            <><FiSave size={20} /> Save Changes</>
                        )}
                    </button>
                </div>
            </motion.form>

            <AnimatePresence>
                {toast && (
                    <motion.div 
                        className={`profile-toast toast-${toast.type}`}
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    >
                        {toast.type === 'success' ? <FiCheckCircle size={24} /> : <FiX size={24} />}
                        <span>{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
