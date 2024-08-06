import styles from "./keyManager.module.css";
import { Button, Col, Row, Spinner, Image, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import RootLayout from "../app/layout";
import NavBar from "../components/NavBar";
import getPermissionedAddresses from "../components/ControllerList";

interface KeyManagerViewProps {}

const KeyManager: React.FC<KeyManagerViewProps> = ({}) => {
  const [account, setAccount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [controllerAddresses, setControllerAddresses] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
      setIsLoading(true); // Reset loading state when account changes
    }
  }, [router.query, account]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const addresses = await getPermissionedAddresses({ account });
      } catch (error) {
        if (error instanceof Error) {
          setError(`An error occurred: ${error.message}`);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchData();
  }, [account]);

  return (
    <div>
      <NavBar account={account} />
      <RootLayout>
        <Row>Test</Row>
      </RootLayout>
    </div>
  );
};

export default KeyManager;
