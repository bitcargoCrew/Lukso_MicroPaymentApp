import React, { useEffect, useState } from "react";
import { Button, Col, Row, Card, Spinner } from "react-bootstrap";
import Link from "next/link";
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
          throw new Error(
            `Failed to fetch job listings: ${response.statusText}`
          );
        }
        const data: JobListing[] = await response.json();
        console.log(data);
        setJobListings(data);
      } catch (error) {
        setError("Failed to fetch job listings");
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
    <Row>
      {jobListings.map((job, index) => (
        <Col key={index} xs={12} md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Row>
                <Card.Title>{job.title}</Card.Title>
              </Row>
              <Row>
                <Card.Text>{job.description}</Card.Text>
              </Row>
              <Row>
                <Link href={`${job.link}`} passHref>
                  <Button variant="dark" style={{marginTop: "5%"}}>Apply here</Button>
                </Link>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default JobBoard;
