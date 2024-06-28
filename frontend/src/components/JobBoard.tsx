import React, { useEffect, useState } from 'react';
import config from "../../config";

interface JobListing {
  title: string;
  description: string;
  link: string;
}

const JobBoard: React.FC = () => {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/getLuksoJobs`);
        if (!response.ok) {
          throw new Error(`Failed to fetch job listings: ${response.statusText}`);
        }
        const data: JobListing[] = await response.json();
        setJobListings(data);
      } catch (error) {
        setError('Failed to fetch job listings');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {jobListings.map((job, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', width: '300px' }}>
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <a href={job.link} target="_blank" rel="noopener noreferrer">
            Apply Here
          </a>
        </div>
      ))}
    </div>
  );
};

export default JobBoard;