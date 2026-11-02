/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package oceanariummanagement;

/**
 *
 * @author ADMIN
 */
import java.sql.Connection;
import java.sql.DriverManager;
import javax.swing.JOptionPane;
import oceanarium.Dashboard;

public class OceanariumManagement {

    /**
     * @param args the command line arguments
     */

    public static void main(String[] args) {
        
        new Dashboard().setVisible(true);

        try {
            Connection con = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/oceanarium_db",
                "root",
                "Root"
            );

            JOptionPane.showMessageDialog(null,
                "Database connected successfully!");

            con.close();

        } catch (Exception e) {
            JOptionPane.showMessageDialog(null, e.getMessage());
        }
    }
}
    
    

