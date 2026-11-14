import sqlite3
import os

def migrate():
    db_path = os.path.join(os.path.dirname(__file__), "..", "mehndi_dev.db")
    if not os.path.exists(db_path):
        print(f"DB not found at {db_path}")
        return
    con = sqlite3.connect(db_path)
    cur = con.cursor()
    info = cur.execute("PRAGMA table_info(addresses);").fetchall()
    user_id_col = next((c for c in info if c[1] == 'user_id'), None)
    print("Before:", user_id_col)
    if user_id_col and user_id_col[3] == 1:
        cur.execute("PRAGMA foreign_keys = OFF;")
        cur.execute("CREATE TABLE addresses_dg_tmp AS SELECT * FROM addresses;")
        cur.execute("DROP TABLE addresses;")
        cur.execute("""CREATE TABLE addresses (
            user_id VARCHAR(36),
            label VARCHAR(50) NOT NULL DEFAULT 'Home',
            full_name VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            address_line_1 VARCHAR(255) NOT NULL,
            address_line_2 VARCHAR(255),
            city VARCHAR(100) NOT NULL,
            state VARCHAR(100) NOT NULL,
            postal_code VARCHAR(20) NOT NULL,
            country VARCHAR(100) NOT NULL DEFAULT 'India',
            is_default BOOLEAN NOT NULL DEFAULT 0,
            id VARCHAR(36) NOT NULL PRIMARY KEY,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users (id)
        );""")
        cur.execute("INSERT INTO addresses SELECT * FROM addresses_dg_tmp;")
        cur.execute("DROP TABLE addresses_dg_tmp;")
        cur.execute("PRAGMA foreign_keys = ON;")
        con.commit()
        print("Migrated successfully.")
    info2 = cur.execute("PRAGMA table_info(addresses);").fetchall()
    print("After:", next((c for c in info2 if c[1] == 'user_id'), None))
    con.close()

if __name__ == "__main__":
    migrate()
