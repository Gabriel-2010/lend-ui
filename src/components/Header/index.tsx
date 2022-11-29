import styles from "./index.less";
import { Button } from "antd";

function Header() {
  return (
    <div className={styles["normal-head"]}>
      <Button
        className={styles.wallet}
        // onClick={onOk}
      >
        Connect
      </Button>
    </div>
  );
}

export default Header;
