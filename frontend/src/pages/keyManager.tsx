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
  const [isLoading, setIsLoading] = useState(false);
  const [controllerAddresses, setControllerAddresses] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const accountQuery = router.query.account;
    if (accountQuery && accountQuery !== account) {
      setAccount(accountQuery as string);
    }
  }, [router.query]);

  useEffect(() => {
    const fetchData = async () => {
      if (!account) return;

      setIsLoading(true);
      setError(null);

      try {
        const addresses = await getPermissionedAddresses({ account });
        setControllerAddresses(addresses);
      } catch (error: any) {
        setError(`An error occurred: ${error.message}`);
        setControllerAddresses(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [account]);

  return (
    <div>
      <NavBar account={account} />
      <RootLayout>
        <Row>
          <Col>
            {isLoading ? (
              <Spinner animation="border" role="status">
              </Spinner>
            ) : error ? (
              <div>
                <p>{error}</p>
              </div>
            ) : controllerAddresses && controllerAddresses.length > 0 ? (
              <ul>
                {controllerAddresses.map((item, index) => (
                  <li key={index}>
                    <div>Address: {item.address}</div>
                    <div>Permissions: {JSON.stringify(item.permissions, null, 2)}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No controller addresses found for this account.</p>
            )}
          </Col>
        </Row>
      </RootLayout>
    </div>
  );
};

export default KeyManager;