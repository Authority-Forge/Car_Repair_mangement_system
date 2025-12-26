# Test Design Document (TDD)
## Garage Management Application MVP

### Categories
1.  **Backend Unit Tests**
2.  **Backend Integration Tests**
3.  **Frontend Unit Tests**
4.  **End-to-End (E2E) Tests**
5.  **Security & Edge Case Tests**

---

### 1. Backend Unit Tests (20 Tests)
*   *Previous tests 1-15...*
16. **VehicleService**: `create` validates VIN format (17 chars).
17. **InvoiceService**: `getStats` calculates YTD spent correctly for user.
18. **SupportService**: `createTicket` accepts valid subjects only.
19. **VehicleService**: `filterByStatus` correctly groups Active vs Archived.
20. **InvoiceService**: `exportAll` generates valid CSV/PDF stream.

### 2. Backend Integration Tests (15 Tests)
*   *Previous tests 16-25...*
26. **POST /vehicles**: Persists new vehicle and photo URL.
27. **GET /invoices/mine**: Returns only invoices belonging to logged-in user.
28. **POST /support/contact**: Sends email/notification to Admin.
29. **GET /vehicles/mine**: Returns 200 with list of vehicles.
30. **GET /invoices/:id/pay**: Updates status from Pending to Paid.

### 3. Frontend Unit Tests (20 Tests)
*   *Previous tests 26-35...*
36. **AddVehicleForm**: Validates required fields (Make, Model, Year).
37. **FAQAccordion**: Toggles content visibility on click.
38. **InvoiceTable**: Renders correct badge color for 'Paid' vs 'Pending'.
39. **ContactForm**: 'Send Message' disabled if fields empty.
40. **VehicleGrid**: Renders 'Service Due' warning if `serviceDue` prop is true.
41. **StatsCard**: Formats currency correctly ($2,845.00).
42. **PhotoUpload**: specific file types (png, jpg) accepted.

### 4. End-to-End (E2E) Tests (10 Tests)
*   *Previous tests 36-40...*
41. **Add Vehicle Flow**: Login Customer -> My Garage -> Add Vehicle -> Upload Photo -> Submit -> Verify in List.
42. **Invoice Payment**: Invoices -> Find Pending -> Pay Now -> Verify Status updates to Paid.
43. **Support Ticket**: Support -> Fill Form -> Send -> Verify Success Message.
44. **Filter Invoices**: Invoices -> Filter by Vehicle -> Verify filtered results.
45. **Vehicle Details**: My Garage -> Click Vehicle -> Verify Details Page load.

### 5. Security & Edge Case Tests (10 Tests)
*   *Previous tests 41-50...*
51. **Auth**: Customer cannot view another customer's invoices.
52. **Upload**: Malicious file upload to Vehicle Photo rejected.
53. **Data**: Accessing `/vehicles/mine` as Mechanic returns specific error or empty (depending on logic).
54. **Input**: SQL Injection attempt in Contact Form Subject.
55. **State**: Paying an already Paid invoice throws error.
