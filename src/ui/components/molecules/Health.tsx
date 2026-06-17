import React from "react";
import Stat from "@components/Stat";
import styles from "./Health.module.css";

interface HealthStats {
    health_max: number;
    health_regen_value: number;
    health_regen_rate: number;
}

interface HealthProps {
    stats: HealthStats;
}

const Health: React.FC<HealthProps> = ({ stats }) => {
    const { health_max, health_regen_value, health_regen_rate } = stats;
    const regen = health_regen_value * health_regen_rate;

    return (
        <>
            <dl className={styles.healthBar}>
                <Stat label={"HP"} value={health_max} />
            </dl>
            <dl className={styles.healthRegen}>
                <Stat label="Regen" delimeter={" "} value={regen} />
            </dl>
        </>
    );
};

export default Health;
