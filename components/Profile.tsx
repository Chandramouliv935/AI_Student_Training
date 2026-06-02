import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { CheckCircle } from './ui/Icons';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Alert from './ui/Alert';

interface ProfileProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [skillsInput, setSkillsInput] = useState(userProfile.skills.join(', '));
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setFormData(userProfile);
    setSkillsInput(userProfile.skills.join(', '));
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile = {
      ...formData,
      skills: skillsInput.split(',').map(s => s.trim()).filter(s => s),
    };
    onUpdateProfile(updatedProfile);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const experienceOptions = [
    { value: 'Fresher', label: 'Fresher' },
    { value: '0-1 Years', label: '0-1 Years' },
    { value: '1-3 Years', label: '1-3 Years' },
    { value: '3+ Years', label: '3+ Years' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <header>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Profile Settings</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">This information helps personalize your career guidance.</p>
      </header>

      {showSuccess && (
        <Alert variant="success" title="Profile updated successfully!" className="animate-fade-in" />
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Information Card */}
        <Card className="p-8 dark:bg-neutral-900 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="dark:bg-neutral-850"
            />
            <Input
              label="Email Address"
              name="email"
              value={formData.email}
              type="email"
              onChange={handleChange}
              disabled={!isEditing}
              className="dark:bg-neutral-850"
            />
          </div>
        </Card>

        {/* Professional Details Card */}
        <Card className="p-8 dark:bg-neutral-900 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Professional Details</h2>
          <div className="space-y-6">
            <Input
              label="Professional Headline"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="e.g., Aspiring Full Stack Developer"
              className="dark:bg-neutral-850"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Target Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., Software Engineer Fresher"
                className="dark:bg-neutral-850"
              />
              <Select
                label="Experience Level"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                disabled={!isEditing}
                options={experienceOptions}
                className="dark:bg-neutral-850"
              />
            </div>
          </div>
        </Card>
        
        {/* Key Skills Card */}
        <Card className="p-8 dark:bg-neutral-900 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Key Skills</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">Separate skills with a comma.</p>
          {isEditing ? (
            <Input
              name="skills"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, Node.js, Python..."
              className="dark:bg-neutral-850"
            />
          ) : (
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.skills.length > 0 ? (
                formData.skills.map((skill, i) => (
                  <Badge key={i} variant="primary">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-neutral-400">No skills added yet.</p>
              )}
            </div>
          )}
        </Card>
        
        {/* Online Presence Card */}
        <Card className="p-8 dark:bg-neutral-900 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">Online Presence</h2>
          <div className="space-y-4">
            <Input
              label="LinkedIn URL"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              type="url"
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="https://linkedin.com/in/..."
              className="dark:bg-neutral-850"
            />
            <Input
              label="GitHub URL"
              name="githubUrl"
              value={formData.githubUrl}
              type="url"
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="https://github.com/..."
              className="dark:bg-neutral-850"
            />
            <Input
              label="Portfolio URL"
              name="portfolioUrl"
              value={formData.portfolioUrl}
              type="url"
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="https://your-domain.com"
              className="dark:bg-neutral-850"
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="pt-4 flex items-center justify-end gap-4">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(userProfile);
                  setSkillsInput(userProfile.skills.join(', '));
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;