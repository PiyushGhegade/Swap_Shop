import { Phone, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnshAvatar from './avatar/ANSH.png';
import PiyushAvatar from './avatar/Piyush.jpg';
import HimanshuAvatar from './avatar/Himanshu.png';
import SparshAvatar from './avatar/Sparsh.jpg';
import AtulAvatar from './avatar/Atul.jpg';
import AbhayAvatar from './avatar/Abhay.jpg';

const teamMembers = [
  {
    name: "Ansh Prem",
    email: "ansh_2302cs01@iitp.ac.in",
    rollno: "2302CS01",
    phone: "+91 9341977395",
    avatar: AnshAvatar,
    linkedin: "https://www.linkedin.com/in/ansh-prem-2137a7331/",
  },
  {
    name: "Sparsh Rastogi",
    email: "sparsh_2301ai56@iitp.ac.in",
    rollno: "2301AI56",
    phone: "+91 8433163922",
    avatar: SparshAvatar,
    linkedin: "https://www.linkedin.com/in/sparsh-rastogi-3a72a3285/",
  },
  {
    name: "Abhay Pratap Singh",
    email: "abhay_2301ai48@iitp.ac.in",
    rollno: "2301AI48",
    phone: "+91 8852055214",
    avatar: AbhayAvatar ,
    linkedin: "https://www.linkedin.com/in/abhay-pratap-singh-400860290/",
  },
  {
    name: "Piyush Shubhash Ghegade",
    email: "piyush_2301ai52@iitp.ac.in",
    rollno: "2301AI52",
    phone: "+91 8208263289",
    avatar: PiyushAvatar,
    linkedin: "https://www.linkedin.com/in/piyush-ghegade-422589316/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
  {
    name: "Himanshu Kumar",
    email: "himanshu_2301ai39@iitp.ac.in",
    rollno: "2301AI39",
    phone: "+91 9471638858",
    avatar: HimanshuAvatar,
    linkedin: "https://www.linkedin.com/in/himanshu-kumar-b2a7b0282?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
  {
    name: "Atul Raj Choudhary",
    email: "atul_2301ai40@iitp.ac.in",
    rollno: "2301AI40",
    phone: "+91 8960584132",
    avatar: AtulAvatar,
    linkedin: "https://www.linkedin.com/in/atul-raj-b3b4b630a/",
  },
];

const DeveloperTeamPage = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-12">Our Developers Team</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white shadow-2xl rounded-2xl p-8 flex flex-col items-center transition hover:scale-[1.02]"
          >
            {/* Avatar */}
            <div className="w-36 h-36 rounded-xl overflow-hidden mb-6 border-2 border-gray-200">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Member Info */}
            <h3 className="text-2xl font-bold mb-2 text-center">{member.name}</h3>

            <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {member.email}
            </div>

            <p className="text-sm text-gray-800 font-bold mb-1">{member.rollno}</p>

            <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {member.phone}
            </div>

            {/* LinkedIn Button */}
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button variant="outline" className="w-full font-semibold flex gap-2 justify-center">
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </Button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperTeamPage;
