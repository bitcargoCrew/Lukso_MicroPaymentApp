import styles from "./socialLeaderboard.module.css";
import { Button, Col, Row, Spinner, Image } from "react-bootstrap";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import RootLayout from "../app/layout";
import NavBar from "../components/NavBar";


const SocialLeaderboard: React.FC = ({}) => {
  const [account, setAccount] = useState("");
  const router = useRouter();

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }
  }, [router.query, account]);

  return (
    <div>
      <NavBar account={account} />
      <RootLayout>
        <div>Work in progress</div>
      </RootLayout>
    </div>
  );
};

export default SocialLeaderboard;