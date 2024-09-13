import styles from "./socialLeaderboard.module.css";
import { Button, Col, Row, Spinner, Image, Table } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import RootLayout from "../app/layout";
import NavBar from "../components/NavBar";
import { config } from "../../config";
import SupporterInformation from "@/components/SupporterInformation";

const SocialLeaderboard: React.FC = ({}) => {
  const [account, setAccount] = useState("");
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }
  }, [router.query, account]);

  const fetchSocialLeaderboardData = useCallback(async () => {
    try {
      const response = await fetch(`${config.apiUrl}/aggregateSocialLeaderboard`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboardData(data);
      } else {
        setError(`Failed to fetch content data: ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`An error occurred: ${error.message}`);
      } else {
        setError("An unknown error occurred.");
      }
    }
  }, []);

  useEffect(() => {
    fetchSocialLeaderboardData();
  }, [fetchSocialLeaderboardData]);

  return (
    <div>
      <NavBar account={account} />
      <RootLayout>
        <div>
        <h1 className={styles.rowSpace}>This is the Social Leaderboard of Quill</h1>
          <Table hover style={{ border: 'none' }}>
            <thead style={{ border: 'none' }}>
              <tr>
                <th>Ranking</th>
                <th>Universal Profile</th>
                <th>Number of Reads</th>
                <th>Number of Likes</th>
                <th>Amount of Quill Tokens received</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((item, index) => (
                <tr key={item.contentSupporter}>
                  <td style={{ borderBottom: '1px solid #e0e0e0', verticalAlign: 'middle'}}>{index + 1}</td>
                  <td style={{ borderBottom: '1px solid #e0e0e0', verticalAlign: 'middle'}}><SupporterInformation contentSupporter={item.contentSupporter} /></td>
                  <td style={{ borderBottom: '1px solid #e0e0e0', verticalAlign: 'middle'}}>{item.totalReads}</td>
                  <td style={{ borderBottom: '1px solid #e0e0e0', verticalAlign: 'middle'}}>{item.totalLikes}</td>
                  <td style={{ borderBottom: '1px solid #e0e0e0', verticalAlign: 'middle'}}><strong>{item.totalTokensReceived}</strong></td>
                </tr>
              ))}
            </tbody>
          </Table>
          {error && <p className="text-danger">{error}</p>}
        </div>
      </RootLayout>
    </div>
  );
};

export default SocialLeaderboard;