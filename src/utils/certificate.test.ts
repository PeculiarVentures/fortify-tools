import { certificateSubjectToString, getCertificateName } from "./certificate";

import { CertificateProps, CertificateSubjectProps } from "../types";

describe("Certificate Utilities", () => {
  describe("certificateSubjectToString", () => {
    const dafaultAttrs = {
      CN: ["Common Name"],
      G: ["Given Name"],
      SN: ["Surname"],
      E: ["email@example.com"],
    } as unknown as CertificateSubjectProps;
    it("Should convert certificate subject attributes to string", () => {
      expect(certificateSubjectToString(dafaultAttrs)).toEqual(
        "CN=Common Name, G=Given Name, SN=Surname, E=email@example.com"
      );
    });

    it("Should skip empty values", () => {
      expect(
        certificateSubjectToString({
          ...dafaultAttrs,
          G: [],
        } as unknown as CertificateSubjectProps)
      ).toEqual("CN=Common Name, SN=Surname, E=email@example.com");
    });

    it("Should return an empty string if no attributes are provided", () => {
      expect(
        certificateSubjectToString({} as unknown as CertificateSubjectProps)
      ).toEqual("");
    });
  });

  describe("getCertificateName", () => {
    it("Should return Common Name if present", () => {
      const certificate = {
        subject: {
          CN: ["Common Name"],
        },
        subjectName: "Subject Name",
      } as unknown as CertificateProps;

      expect(getCertificateName(certificate)).toEqual("Common Name");
    });

    it("Should return Given Name and Surname if both present", () => {
      const certificate = {
        subject: {
          G: ["Given Name"],
          SN: ["Surname"],
        },
        subjectName: "Subject Name",
      } as unknown as CertificateProps;

      expect(getCertificateName(certificate)).toEqual("Given Name Surname");
    });

    it("Should return Email if no Common Name, Given Name or Surname", () => {
      const certificate = {
        subject: {
          E: ["email@example.com"],
        },
        subjectName: "Subject Name",
      } as unknown as CertificateProps;

      expect(getCertificateName(certificate)).toEqual("email@example.com");
    });

    it("Should return the subjectName if no subject is provided", () => {
      const certificate = {
        subject: null,
        subjectName: "Subject Name",
      } as unknown as CertificateProps;

      expect(getCertificateName(certificate)).toEqual("Subject Name");
    });

    it("Should return the subjectName if no fields are present in subject", () => {
      const certificate = {
        subject: {},
        subjectName: "Subject Name",
      } as unknown as CertificateProps;

      expect(getCertificateName(certificate)).toEqual("Subject Name");
    });
  });
});
